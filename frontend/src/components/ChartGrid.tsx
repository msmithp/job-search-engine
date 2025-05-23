/** ChartGrid.tsx * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * The ChartGrid component displays a list of charts (stylized as a grid in
 * App.css). Each chart is a SkillChart.
 */


import { SkillChart } from "../components";
import { ChartSkillData } from "../static/types";

interface ChartGridProps {
    data: ChartSkillData[]
}

function ChartGrid({ data }: ChartGridProps) {
    // Create charts array
    const charts = data.map(chartData => 
        <div key={chartData.category} style={{ height: "300px" }}>
            <SkillChart key={chartData.category}
                skillData={chartData.skills}
                title={chartData.category}
            />
        </div>
    );

    return (
        <div className="grid">
            {charts}
        </div>
    )
}

export default ChartGrid;
