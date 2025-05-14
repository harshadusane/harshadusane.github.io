import { h, render } from 'preact';
import { useState } from 'preact/hooks';
import htm from 'htm';

const html = htm.bind(h);

function Counter() {
    const [count, setCount] = useState(0);
    return html`
      <div class="text-center p-6 border border-gray-300 rounded-lg shadow-lg bg-white max-w-md mx-auto">
        <p class="text-xl font-semibold text-gray-700 mb-4">Interactive Counter: <span class="text-teal-600 font-bold">${count}</span></p>
        <button
          class="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded mr-2 transition-colors duration-150"
          onClick=${() => setCount(count + 1)}>
          Increment +
        </button>
        <button
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-150"
          onClick=${() => setCount(count - 1)}>
          Decrement -
        </button>
      </div>
    `;
}

// --- Savings Calculator Component ---
const FILES_PER_STUDY = 400; // Average files per study/case
const BASE_COST_PER_FILE_PER_YEAR_RELIABLE = 0.20; // Example cost in INR (₹)
const FIXED_IN_HOUSE_COST_MULTIPLIER = 3; // In-house is 3x the cost of Reliable Archival

const storageDurationOptions = [
    { value: 5, label: '5 Years' },
    { value: 10, label: '10 Years' },
    { value: 15, label: '15 Years' },
    { value: 20, label: '20 Years' },
    { value: 25, label: '25 Years' }
];

function SavingsCalculator() {
    const [studiesPerMonth, setStudiesPerMonth] = useState(5); // Default studies
    const [selectedDuration, setSelectedDuration] = useState(storageDurationOptions[1].value); // Default 15 years
    const [showInHouseInfo, setShowInHouseInfo] = useState(false); // State for popup visibility

    const handleStudiesChange = (e) => setStudiesPerMonth(parseInt(e.target.value, 10) || 0);
    const handleDurationChange = (e) => setSelectedDuration(parseInt(e.target.value, 10));

    // Calculations:
    // Cost model: Total cost = (Annual Files Generated) * (Cost Per File Per Year) * (Storage Duration)^2
    // This accounts for new files being added each year and stored for the full duration.
    const annualFilesGeneratedFactor = studiesPerMonth * FILES_PER_STUDY * 12;
    const selectedMultiplier = FIXED_IN_HOUSE_COST_MULTIPLIER; // Use the fixed multiplier

    const totalReliableCost = annualFilesGeneratedFactor * BASE_COST_PER_FILE_PER_YEAR_RELIABLE * (selectedDuration * selectedDuration);
    const totalInHouseCost = annualFilesGeneratedFactor * (BASE_COST_PER_FILE_PER_YEAR_RELIABLE * selectedMultiplier) * (selectedDuration * selectedDuration);
    const savings = totalInHouseCost - totalReliableCost;

    // Total unique files generated over the period that need archiving
    const totalUniqueFilesToArchive = studiesPerMonth * FILES_PER_STUDY * 12 * selectedDuration;

    return html`
        <div class="bg-gray-100 p-6 md:p-8 rounded-lg shadow-xl my-10">
            <h3 class="text-2xl md:text-3xl font-bold text-center text-teal-700 mb-6">Archival Savings Calculator</h3>
            <p class="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                Estimate your potential savings. Assumes an average of ${FILES_PER_STUDY} files per study/case. Costs are in INR (₹).
                In-house maintenance is estimated to be ${FIXED_IN_HOUSE_COST_MULTIPLIER}x the cost of Reliable Archival.
            </p>

            <div class="grid md:grid-cols-2 gap-6 mb-8 max-w-xl mx-auto">
                <div>
                    <label htmlFor="studiesPerMonth" class="block text-sm font-medium text-gray-700 mb-1">Studies/Cases per Month:</label>
                    <input
                        type="number"
                        id="studiesPerMonth"
                        value=${studiesPerMonth}
                        onInput=${handleStudiesChange}
                        min="0"
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="storageDuration" class="block text-sm font-medium text-gray-700 mb-1">Storage Duration:</label>
                    <select
                        id="storageDuration"
                        value=${selectedDuration}
                        onChange=${handleDurationChange}
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    >
                        ${storageDurationOptions.map(opt => html`<option value=${opt.value}>${opt.label}</option>`)}
                    </select>
                </div>
            </div>

            ${studiesPerMonth > 0 && selectedDuration > 0 ? html`
                <div class="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto">
                    <h4 class="text-xl font-semibold text-gray-800 mb-4 text-center">Estimated Results (Over ${selectedDuration} Years)</h4>
                    <div class="space-y-3 text-gray-700">
                        <p><strong>Total Unique Files Generated & Archived:</strong> ${totalUniqueFilesToArchive.toLocaleString()}</p>
                        <div class="relative">
                            <p>
                                <strong>Estimated In-House Archival Cost:</strong> ₹${totalInHouseCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                <span
                                    class="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-300 text-gray-800 text-xs font-bold cursor-pointer hover:bg-gray-400 transition-colors"
                                    onMouseEnter=${() => setShowInHouseInfo(true)}
                                    onMouseLeave=${() => setShowInHouseInfo(false)}
                                >
                                    i
                                </span>
                            </p>
                            ${showInHouseInfo && html`
                                <div 
                                 onMouseEnter=${() => setShowInHouseInfo(true)}
                                    onMouseLeave=${() => setShowInHouseInfo(false)}
                                class="absolute z-10 mt-2 w-128 p-4 bg-gray-800 text-white text-sm rounded-md shadow-lg opacity-95 pointer-events-none left-0 md:left-auto"> 
                                    <p class="font-semibold mb-1">In-house costs include:</p>
                                    <ul class="list-disc list-inside space-y-1">
                                        <li>Transportation</li><li>CCTV & Security</li><li>Temperature & Humidity Control</li><li>Maintenance & Staff</li>
                                    </ul>
                                    <p class="mt-3"><strong>Reliable Archival's Edge:</strong> We achieve cost-effectiveness by managing archival volumes approximately 20 times larger than typical individual study centers. This scale allows us to optimize resources and pass the savings to you.</p>
                                </div>
                            `}
                        </div>
                        <div class="pt-3 mt-3 border-t border-gray-200">
                            <p class="text-xl font-bold text-green-600 text-center md:text-left">
                                Savings with us:
                                <span class="block text-2xl mt-1 md:mt-0 md:ml-2">₹ ${savings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                            </p>
                        </div>
                    </div>
                </div>
            ` : html`
                <p class="text-center text-gray-500 mt-6">Enter the number of studies/cases per month to see cost estimations.</p>
            `}
        </div>
    `;
}

function App() {
    // <${Counter} />
    return html`
      <div class="container mx-auto px-4 py-6">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">A Touch of Modern Interactivity</h2>
        <${SavingsCalculator} />
      </div>
    `;
}

// render(html`<${App} />`, document.getElementById('preact-root'));
render(html`<${SavingsCalculator} />`, document.getElementById('preact-simulator-root'));