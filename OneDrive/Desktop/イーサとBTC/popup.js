class CryptoPriceTracker {
    constructor() {
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.fetchPrices();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn.addEventListener('click', () => {
            this.fetchPrices();
        });
    }

    async fetchPrices() {
        try {
            this.setLoadingState(true);
            
            // 並列で価格とガス代を取得
            const [priceResponse, ethGasData, btcFeeData] = await Promise.all([
                fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd,jpy&include_24hr_change=true'),
                this.fetchEthGas(),
                this.fetchBtcFees()
            ]);
            
            if (!priceResponse.ok) {
                throw new Error(`HTTP error! status: ${priceResponse.status}`);
            }
            
            const priceData = await priceResponse.json();
            
            this.updatePrices(priceData);
            this.updateGasPrices(ethGasData, btcFeeData);
            this.updateRefreshTime();
            this.clearError();
            
        } catch (error) {
            console.error('データ取得エラー:', error);
            this.showError('データの取得に失敗しました');
        } finally {
            this.setLoadingState(false);
        }
    }

    async fetchEthGas() {
        try {
            const response = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken');
            if (!response.ok) throw new Error('ETH gas fetch failed');
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('ETHガス代取得エラー:', error);
            return null;
        }
    }

    async fetchBtcFees() {
        try {
            const response = await fetch('https://mempool.space/api/v1/fees/recommended');
            if (!response.ok) throw new Error('BTC fee fetch failed');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('BTC手数料取得エラー:', error);
            return null;
        }
    }

    updatePrices(data) {
        // ETH価格更新
        const ethPrice = data.ethereum.usd;
        const ethPriceJpy = data.ethereum.jpy;
        const ethChange = data.ethereum.usd_24h_change;
        
        document.getElementById('eth-price').textContent = `$${ethPrice.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
        
        document.getElementById('eth-price-jpy').textContent = `¥${ethPriceJpy.toLocaleString('ja-JP', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })}`;
        
        const ethChangeElement = document.getElementById('eth-change');
        ethChangeElement.textContent = `${ethChange >= 0 ? '+' : ''}${ethChange.toFixed(2)}%`;
        ethChangeElement.className = `change ${ethChange >= 0 ? 'positive' : 'negative'}`;

        // BTC価格更新
        const btcPrice = data.bitcoin.usd;
        const btcPriceJpy = data.bitcoin.jpy;
        const btcChange = data.bitcoin.usd_24h_change;
        
        document.getElementById('btc-price').textContent = `$${btcPrice.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
        
        document.getElementById('btc-price-jpy').textContent = `¥${btcPriceJpy.toLocaleString('ja-JP', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })}`;
        
        const btcChangeElement = document.getElementById('btc-change');
        btcChangeElement.textContent = `${btcChange >= 0 ? '+' : ''}${btcChange.toFixed(2)}%`;
        btcChangeElement.className = `change ${btcChange >= 0 ? 'positive' : 'negative'}`;
    }

    updateGasPrices(ethGasData, btcFeeData) {
        // ETHガス代更新
        if (ethGasData) {
            document.getElementById('eth-gas-slow').textContent = `遅い: ${ethGasData.SafeGasPrice} gwei`;
            document.getElementById('eth-gas-standard').textContent = `標準: ${ethGasData.ProposeGasPrice} gwei`;
            document.getElementById('eth-gas-fast').textContent = `高速: ${ethGasData.FastGasPrice} gwei`;
        }

        // BTC手数料更新
        if (btcFeeData) {
            document.getElementById('btc-fee-slow').textContent = `遅い: ${btcFeeData.economyFee} sat/vB`;
            document.getElementById('btc-fee-standard').textContent = `標準: ${btcFeeData.hourFee} sat/vB`;
            document.getElementById('btc-fee-fast').textContent = `高速: ${btcFeeData.fastestFee} sat/vB`;
        }
    }

    updateRefreshTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('refreshTime').textContent = `最終更新: ${timeString}`;
    }

    setLoadingState(isLoading) {
        const refreshBtn = document.getElementById('refreshBtn');
        const container = document.querySelector('.container');
        
        if (isLoading) {
            refreshBtn.textContent = '更新中...';
            refreshBtn.disabled = true;
            container.classList.add('loading');
        } else {
            refreshBtn.textContent = '更新';
            refreshBtn.disabled = false;
            container.classList.remove('loading');
        }
    }

    showError(message) {
        let errorElement = document.querySelector('.error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error';
            document.querySelector('.container').appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearError() {
        const errorElement = document.querySelector('.error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    startAutoRefresh() {
        // 30秒ごとに自動更新
        this.refreshInterval = setInterval(() => {
            this.fetchPrices();
        }, 30000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
}

// ポップアップが開かれたときに初期化
document.addEventListener('DOMContentLoaded', () => {
    new CryptoPriceTracker();
});

// ポップアップが閉じられるときにタイマーをクリア
window.addEventListener('beforeunload', () => {
    if (window.tracker) {
        window.tracker.stopAutoRefresh();
    }
});