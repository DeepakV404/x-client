import { Pie } from '@ant-design/plots';

// Add ap type here

const SalesPersonCard = (props: {salesReport: any, profile?: string, size?: number, showEmptyData?: boolean}) => {

    const { salesReport, profile, size=120, showEmptyData }   =   props;

    const emptyData = [
        { status: "Planned", value: 100 },
        { status: "On-Going", value: 0 },
        { status: "Pending", value: 0 },
        { status: "Finished", value: 0 },
    ];
    
    const data = [
        {
            status: 'Planned',
            value: salesReport?.plannedAps || 0,
        },
        {
            status: 'On-Going',
            value: salesReport?.onGoingAps || 0,
        },
        {
            status: 'Pending',
            value: salesReport?.pendingAps || 0,
        },
        {
            status: 'Finished',
            value: salesReport?.completedAps || 0,
        },
    ];

    const config: any = {
        data: showEmptyData ? emptyData : data,
        angleField: 'value',
        colorField: 'status',
        radius: 1,
        innerRadius: showEmptyData ? 0.68 : 0.7,
        color: showEmptyData ? ["#f2f2f2", "#f2f2f2", "#f2f2f2", "#f2f2f2"] : ["#2979FF", "#FF9800", "#FF1744", "#00C853"],
        legend: false,
        label: false,
        tooltip: showEmptyData ? false : {
            style: {
                fontSize: 14,
                color: '#000',
                fontFamily: 'Inter'
            },
            customContent: (_: string, items: any[]) => {
                const formattedItems = items.map(item => {
                    const { status, value } = item.data;
    
                    const formattedType = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
                    return `
                        <div style="display: flex;">
                            <span class="cm-font-fam400">${formattedType} : &nbsp; </span>
                            <span class="cm-font-fam600">${Math.ceil(value)}</span>
                        </div>
                    `;
                });
        
                return `
                    <div style="padding: 8px;">
                        ${formattedItems.join('')}
                    </div>
                `;
            },
        },
        statistic: {
            title: false,
            content: {
                customHtml: () => {
                    return `<div style="width: 30px; height: 30px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                                ${!showEmptyData ? `<img src=${profile ? profile : "https://static.buyerstage.io/static-assets/user-logo.png"} style="width: 100%; height: 100%; object-fit: cover;" alt="center-img"/>` : ""}
                            </div>`;
                },
            },
        },
    };

    return (
        <div style={{ width: size, height: size }}>
            <Pie {...config} />
        </div>
    );
};

export default SalesPersonCard;
