import RangeNumber from "@components/RangeNumber";
import RoundedContainer from "@components/RoundedContainer";
import SelectionWithDescription from "@components/SelectionWithDescription";
import { useMemo, useState } from "react";
import Cookies from "universal-cookie";

const App = () => {
  const cookies = new Cookies(null, { path: "/" });
  const [energyEconomy, setEnergyEconomy] = useState(cookies.get("phev-ecc-energy-economy") || 1);
  const [fuelEconomy, setFuelEconomy] = useState(cookies.get("phev-ecc-fuel-economy") || 1);
  const [powerSource, setPowerSource] = useState(cookies.get("phev-ecc-power-source") || "");
  const [fuelPrice, setFuelPrice] = useState(cookies.get("phev-ecc-fuel-price") || 1);
  const [powerPrice, setPowerPrice] = useState(cookies.get("phev-ecc-power-price") || 1);
  const powerCost = useMemo(() => {
    const unitPrice = powerSource === "Other" ? powerPrice : (powerRates.get(powerSource)?.rate ?? 0);
    return (energyEconomy * unitPrice) / chargerEfficiency;
  }, [powerSource, energyEconomy, powerPrice]);
  const fuelCost = useMemo(() => {
    return fuelEconomy * fuelPrice;
  }, [fuelEconomy, fuelPrice]);
  const costDifference = useMemo(() => {
    return Math.abs(powerCost - fuelCost);
  }, [powerCost, fuelCost]);
  // Budget state
  const [budget, setBudget] = useState(cookies.get("phev-ecc-budget") || 20);

  return (
    <>
      <div className="flex flex-col gap-4 px-1 md:p-4">
        <div className="flex pt-4 md:pt-1 items-center justify-around md:justify-between gap-1 text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-bold">Gino&apos;s PHEV Energy Cost Calculator</h1>
          <p className="text-sm text-gray-500">v0.1.1</p>
        </div>

        <div className="flex flex-col gap-1">
          <RoundedContainer title="How's your driving?">
            <RangeNumber
              min={1}
              max={50}
              value={energyEconomy}
              label="Average energy economy (KW-h/100KM)?"
              onChange={(e) => {
                setEnergyEconomy(Number(e.target.value));
                cookies.set("phev-ecc-energy-economy", Number(e.target.value));
              }}
            />

            <RangeNumber
              min={1}
              max={30}
              value={fuelEconomy}
              label="Average fuel economy (L/100KM)?"
              onChange={(e) => {
                setFuelEconomy(Number(e.target.value));
                cookies.set("phev-ecc-fuel-economy", Number(e.target.value));
              }}
            />
          </RoundedContainer>

          <RoundedContainer title="Energy sources">
            <SelectionWithDescription
              title="Who provides electricity?"
              options={Array.from(powerRates.entries()).map(([name, { description }]) => ({ name, description }))}
              choice={powerSource}
              onChange={(e) => {
                setPowerSource(e.target.value);
                cookies.set("phev-ecc-power-source", e.target.value);
              }}
              placeholder="Select a power provider"
            />

            {powerSource === "Other" && (
              <RangeNumber
                min={1}
                max={100}
                value={powerPrice}
                label="Cost of power (PHP/KW)?"
                onChange={(e) => {
                  setPowerPrice(Number(e.target.value));
                  cookies.set("phev-ecc-power-price", Number(e.target.value));
                }}
              />
            )}

            <RangeNumber
              min={1}
              max={100}
              value={fuelPrice}
              label="Cost of gas (PHP/L)?"
              onChange={(e) => {
                setFuelPrice(Number(e.target.value));
                cookies.set("phev-ecc-fuel-price", Number(e.target.value));
              }}
            />
          </RoundedContainer>

          <RoundedContainer title="Budget">
            <RangeNumber
              min={0}
              max={10000}
              step={1}
              value={budget}
              label="How much is your budget (PHP)?"
              onChange={(e) => {
                setBudget(Number(e.target.value));
                cookies.set("phev-ecc-budget", Number(e.target.value));
              }}
            />
          </RoundedContainer>

          <RoundedContainer title="Results" className={powerCost === 0 ? "hidden" : ""}>
            <p>
              It costs <strong>PHP {powerCost.toFixed(2)}</strong> per 100KM if you drive in <strong>EV mode</strong>,
              and <strong>PHP {fuelCost.toFixed(2)}</strong> per 100KM if you drive in <strong>HEV mode</strong>.
              Driving in {fuelCost > powerCost ? "EV" : "HEV"} mode is cheaper by{" "}
              <strong>PHP {costDifference.toFixed(2)}</strong>.
            </p>
            <p>
              If you have a budget of <strong>PHP {budget}</strong>, you can drive up to{" "}
              <strong>{((budget / powerCost) * 100).toFixed(2)}</strong> KM in <strong>EV mode</strong>, or{" "}
              <strong>{((budget / fuelCost) * 100).toFixed(2)}</strong> KM in <strong>HEV mode</strong>.
            </p>
          </RoundedContainer>
        </div>
      </div>
    </>
  );
};

const powerRates = new Map<string, { rate: number; description: string }>([
  ["Meralco", { rate: 13.0851, description: "PHP 13.0851 per kWh as of September 2025" }],
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
  ["Other", { rate: 0, description: "" }],
]);

const chargerEfficiency = 0.9; // 6.3KW to the car, 7KW from the wall, and 1.9KW to the car, 2.1KW from the wall

export default App;
