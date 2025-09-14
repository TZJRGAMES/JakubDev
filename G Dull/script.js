let chart;
let selectedCurrency = 'usd';

function updateCurrency() {
  const currencySelect = document.getElementById('currency');
  selectedCurrency = currencySelect.value;
}

async function loadChart(coin) {
  const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=${selectedCurrency}&days=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const prices = data.prices.map(p => ({
      time: new Date(p[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: p[1]
    }));

    const labels = prices.map(p => p.time);
    const values = prices.map(p => p.price);

    if (chart) {
      chart.destroy();
    }

    const ctx = document.getElementById('priceChart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${coin.charAt(0).toUpperCase() + coin.slice(1)} Price (${selectedCurrency.toUpperCase()})`,
          data: values,
          borderColor: getCoinColor(coin),
          backgroundColor: getCoinColor(coin, 0.2),
          fill: true,
          tension: 0.3,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#000'
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#000' }
          },
          y: {
            ticks: { color: '#000' }
          }
        }
      }
    });

  } catch (err) {
    alert('Error loading chart. Try again later.');
    console.error(err);
  }
}

function getCoinColor(coin, opacity = 1) {
  const colors = {
    bitcoin: `rgba(0, 0, 0, ${opacity})`,
    ethereum: `rgba(0, 0, 0, ${opacity})`,
    cardano: `rgba(0, 0, 0, ${opacity})`,
    dogecoin: `rgba(0, 0, 0, ${opacity})`
  };
  return colors[coin] || `rgba(0, 0, 0, ${opacity})`;
}