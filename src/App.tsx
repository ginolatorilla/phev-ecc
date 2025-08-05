import RangeNumber from "@components/RangeNumber";
import RoundedContainer from "@components/RoundedContainer";
import SelectionWithDescription from "@components/SelectionWithDescription";
import { useMemo, useState } from "react";

const App = () => {
  const [energyEconomy, setEnergyEconomy] = useState(1);
  const [fuelEconomy, setFuelEconomy] = useState(1);
  const [powerSource, setPowerSource] = useState("");
  const [fuelPrice, setFuelPrice] = useState(1);
  const [powerPrice, setPowerPrice] = useState(1);
  const powerCost = useMemo(() => {
    const unitPrice = powerSource === "Other" ? powerPrice : (powerRates.get(powerSource)?.rate ?? 0);
    return (energyEconomy * unitPrice) / chargerEfficiency;
  }, [powerSource, energyEconomy, powerPrice]);
  const fuelCost = useMemo(() => {
    return fuelEconomy * fuelPrice;
  }, [fuelEconomy, fuelPrice]);
  const [budget, setBudget] = useState(20);

  return (
    <>
      <h1>EV Energy Cost Calculator</h1>

      <RoundedContainer title="How's your driving?">
        <RangeNumber
          min={1}
          max={50}
          value={energyEconomy}
          label="Avg. energy economy (KWh/100KM)?"
          onChange={(e) => setEnergyEconomy(Number(e.target.value))}
        />

        <RangeNumber
          min={1}
          max={30}
          value={fuelEconomy}
          label="Avg. fuel economy (L/100KM)?"
          onChange={(e) => setFuelEconomy(Number(e.target.value))}
        />
      </RoundedContainer>

      <RoundedContainer title="Energy sources">
        <SelectionWithDescription
          title="Who provides electricity?"
          options={Array.from(powerRates.entries()).map(([name, { description }]) => ({ name, description }))}
          choice={powerSource}
          onChange={(e) => setPowerSource(e.target.value)}
          placeholder="Select a power provider"
        />

        {powerSource === "Other" && (
          <RangeNumber
            min={1}
            max={100}
            value={powerPrice}
            label="Cost of power (PHP/KW)?"
            onChange={(e) => setPowerPrice(Number(e.target.value))}
          />
        )}

        <RangeNumber
          min={1}
          max={100}
          value={fuelPrice}
          label="Cost of gas (PHP/L)?"
          onChange={(e) => setFuelPrice(Number(e.target.value))}
        />
      </RoundedContainer>

      <RoundedContainer title="Budget">
        <RangeNumber
          min={0}
          max={10000}
          value={budget}
          label="How much is your budget (PHP)?"
          onChange={(e) => setBudget(Number(e.target.value))}
        />
      </RoundedContainer>

      <RoundedContainer title="Results" className={powerCost === 0 ? "hidden" : ""}>
        <p>
          It costs <strong>PHP {powerCost.toFixed(2)}</strong> per 100KM if you drive in <strong>EV mode</strong>, and{" "}
          <strong>PHP {fuelCost.toFixed(2)}</strong> per 100KM if you drive in <strong>HEV mode</strong>.
        </p>
        <p>
          If you have a budget of <strong>PHP {budget}</strong>, you can drive up to{" "}
          <strong>{((budget / powerCost) * 100).toFixed(2)}</strong> KM in <strong>EV mode</strong>, or{" "}
          <strong>{((budget / fuelCost) * 100).toFixed(2)}</strong> KM in <strong>HEV mode</strong>.
        </p>
      </RoundedContainer>
    </>
  );
};

const powerRates = new Map<string, { rate: number; description: string }>([
  ["Meralco", { rate: 12.64, description: "PHP 12.64 per kWh as of July 2025" }],
  ["La Union Electric Co-op", { rate: 12.519, description: "PHP 12.519 per kWh as of July 2025" }],
  ["Shell Recharge", { rate: 28, description: "PHP 28 per kWh for AC charging at Luzon" }],
  ["AC Mobility", { rate: 28.5, description: "PHP 28.50 per kWh for AC charging at Luzon" }],
  [
    "AC Mobility Charge500",
    { rate: (28.5 * 500) / 600, description: "PHP 23.75 per kWh (16.67% discount) for AC charging at Luzon" },
  ],
  [
    "AC Mobility Plan1200/2000/4000",
    { rate: (28.5 * 1200) / 1500, description: "PHP 22.80 per kWh (20.7% discount) for AC charging at Luzon" },
  ],
]);

const chargerEfficiency = 0.9; // 6.3KW to the car, 7KW from the wall, and 1.9KW to the car, 2.1KW from the wall

export default App;
