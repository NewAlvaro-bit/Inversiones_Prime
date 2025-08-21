// Chart.js for beautiful, dynamic graphs
// Note: This script is included in the HTML file via a CDN link
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

// Store references to all sections
const sections = {
    about: document.getElementById('about'),
    calculator: document.getElementById('calculator'),
    contact: document.getElementById('contact')
};
let currentChart = null; // Variable to hold the Chart.js instance

/**
 * Hides all sections and displays the requested one.
 * @param {string} sectionId The ID of the section to show.
 */
function showSection(sectionId) {
    for (let id in sections) {
        if (id === sectionId) {
            sections[id].classList.remove('hidden');
            sections[id].classList.add('active');
        } else {
            sections[id].classList.add('hidden');
            sections[id].classList.remove('active');
        }
    }
}

// Add event listener to the calculator form
document.getElementById('calculator-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Get user inputs and parse them as numbers
    const initialAmount = parseFloat(document.getElementById('initial-amount').value) || 0;
    const months = parseInt(document.getElementById('months').value, 10) || 0;

    if (initialAmount <= 0 || months <= 0) {
        document.getElementById('results').classList.add('hidden');
        if (currentChart) currentChart.destroy();
        return;
    }

    // The core calculation logic based on user's rule: 5% of initial capital per month
    const monthlyReturnRate = 0.05;
    const monthlyGain = initialAmount * monthlyReturnRate;
    const totalGains = monthlyGain * months;
    const totalValue = initialAmount + totalGains;

    // Update the results display
    document.getElementById('total-value').textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById('total-gains').textContent = `$${totalGains.toFixed(2)}`;
    document.getElementById('results').classList.remove('hidden');

    // Prepare data for the chart
    const labels = ['Mes 0'];
    const data = [initialAmount];
    let currentValue = initialAmount;
    for (let i = 1; i <= months; i++) {
        labels.push(`Mes ${i}`);
        currentValue += monthlyGain;
        data.push(currentValue);
    }

    // Destroy the previous chart instance if it exists to avoid memory leaks
    if (currentChart) {
        currentChart.destroy();
    }

    // Create a new Chart.js instance
    const ctx = document.getElementById('growth-chart').getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Valor de tu Inversión ($)',
                data: data,
                borderColor: '#3b82f6', // blue-600
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 3,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (context) => `$${context.parsed.y.toFixed(2)}` } }
            },
            scales: {
                x: { title: { display: true, text: 'Meses' } },
                y: {
                    title: { display: true, text: 'Valor ($)' },
                    beginAtZero: true
                }
            }
        }
    });
});
