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
    const unitPrice = powerSource === "Other" ? powerPrice : (powerRates.get(powerSource) ?? 0);
    return energyEconomy * unitPrice;
  }, [powerSource, energyEconomy, powerPrice]);
  const fuelCost = useMemo(() => {
    return fuelEconomy * fuelPrice;
  }, [fuelEconomy, fuelPrice]);

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
          options={[
            { name: "Meralco", description: "PHP 12.64 per kWh as of July 2025" },
            { name: "EVRO", description: "PHP 28.50 per kWh" },
            { name: "Other", description: "Please specify in the input below" },
          ]}
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

      <RoundedContainer title="Results">
        <p>
          <strong>Energy cost per 100KM:</strong> PHP {powerCost.toFixed(2)}
        </p>
        <p>
          <strong>Fuel cost per 100KM:</strong> PHP {fuelCost.toFixed(2)}
        </p>
        <p>
          <strong>Cost difference per 100KM:</strong> PHP {(powerCost - fuelCost).toFixed(2)}
        </p>
        <p>
          <strong>Cost difference per 100KM:</strong>{" "}
          {powerCost - fuelCost < 0 ? "Electricity is cheaper" : "Fuel is cheaper"}
        </p>
      </RoundedContainer>
    </>
  );
};

const powerRates = new Map<string, number>([
  ["Meralco", 12.64],
  ["EVRO", 28.5],
]);

export default App;
