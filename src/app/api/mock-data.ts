const dashboard_list: any[] = [
  { 
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": 'Sales Dashboard',
    "is_public": true,
    "preview_image": "/dashboard-preview.png",
    "updated_at": '2025-03-21T10:30:00Z',
    "chart_count": 5,
    "dataset": "sales.csv",
  },
  { 
    "id": "3f5b3f60-3e7d-4d85-9b7a-8a3a6a7173b0",
    "title": 'Sales Dashboard',
    "is_public": false,
    "preview_image": "/dashboard-preview.png",
    "updated_at": '2025-03-21T10:30:00Z',
    "chart_count": 5,
    "dataset": "sales.csv",
  },
  { 
    "id": "3f0a3f1e-7d7a-4b9c-8a8f-38c18fcd2c69",
    "title": 'Sales Dashboard',
    "is_public": true,
    "preview_image": "/dashboard-preview.png",
    "updated_at": '2025-03-21T10:30:00Z',
    "chart_count": 5,
    "dataset": "sales.csv",
  },
  { 
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": 'Sales Dashboard',
    "is_public": false,
    "preview_image": "/dashboard-preview.png",
    "updated_at": '2025-03-21T10:30:00Z',
    "chart_count": 5,
    "dataset": "sales.csv",
  },
  { 
    "id": "2d762aad-a06e-470a-a180-f945cd49ae9e",
    "title": 'Sales Dashboard',
    "is_public": true,
    "preview_image": "/dashboard-preview.png",
    "updated_at": '2025-03-21T10:30:00Z',
    "chart_count": 5,
    "dataset": "sales.csv",
  },
];

const view_dashboard = {
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "2023 Sales Overview",
  "description": "A summary of solar panel and inverter sales across the first quarter of 2023.",
  "is_public": true,
  "created_at": "2025-03-21T10:30:00Z",
  "updated_at": "2025-03-21T10:30:00Z",
  "user": {
    "first_name": "John",
    "last_name": "Doe",
    "profile_image": null
  },
  "charts": [
    {
      "id": "ca88ef28-9720-414d-88ba-a7968aae6b8b",
      "title": "Total Sales by Product",
      "description": "Total sales of solar panels and inverters in Q1 2023.",
      "data": [
        { "product": "SolarPanels", "sales": 8968 },
        { "product": "Inverters", "sales": 6635 }
      ],
      "config": {
        "type": "bar",
        "index": "product",
        "x_axis_label": "Product",
        "start_end_only": false,
        "categories": ["sales"],
        "y_axis_label": "Total Sales",
        "bar_type": "default",
        "layout": "horizontal",
      },
    },
    {
      "id": "3f5b3f60-3e7d-4d85-9b7a-8a3a6a7173b0",
      "title": "Sales Trend Over Time",
      "description": "Monthly sales trends for solar panels and inverters in Q1 2023.",
      "data": [
        { "date": "Jan 23", "SolarPanels": 2890, "Inverters": 2338 },
        { "date": "Feb 23", "SolarPanels": 2756, "Inverters": 2103 },
        { "date": "Mar 23", "SolarPanels": 3322, "Inverters": 2194 }
      ],
      "config": {
        "type": "bar",
        "index": "date",
        "x_axis_label": "Month",
        "start_end_only": false,
        "categories": ["SolarPanels", "Inverters"],
        "y_axis_label": "Sales",
        "layout": "horizontal",
      },
    },
    {
      "id": "4cede2ee-31d8-4cf0-ae5c-495676a6403a",
      "title": "Sales Trend Over Time",
      "description": "Monthly sales trends for solar panels and inverters in Q1 2023.",
      "data": [
        { "date": "Jan 23", "SolarPanels": 2890, "Inverters": 2338 },
        { "date": "Feb 23", "SolarPanels": 2756, "Inverters": 2103 },
        { "date": "Mar 23", "SolarPanels": 3322, "Inverters": 2194 }
      ],
      "config": {
        "type": "line",
        "index": "date",
        "x_axis_label": "Month",
        "start_end_only": false,
        "categories": ["SolarPanels", "Inverters"],
        "y_axis_label": "Sales",
      },
    },
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "title": "Total Sales by Product",
      "description": "Total sales of solar panels and inverters in Q1 2023.",
      "data": [
        { "product": "SolarPanels", "sales": 8968 },
        { "product": "Inverters", "sales": 6635 }
      ],
      "config": {
        "type": "line",
        "index": "product",
        "x_axis_label": "Product",
        "start_end_only": false,
        "categories": ["sales"],
        "y_axis_label": "Total Sales",
        "bar_type": "default",
      },
    }
  ]
}

const edit_dashboard = {
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "2023 Sales Overview",
  "description": "A summary of solar panel and inverter sales across the first quarter of 2023.",
  "created_at": "2025-03-21T10:30:00Z",
  "updated_at": "2025-03-21T10:30:00Z",
  "is_public": true,
  "dataset": {
    "filename": "datadata.csv",
    "columns": ["date", "product", "sales"],
    "data": [
      { "date": "Jan 23", "product": "SolarPanels", "sales": 2890 },
      { "date": "Jan 23", "product": "Inverters", "sales": 2338 },
      { "date": "Feb 23", "product": "SolarPanels", "sales": 2756},
      { "date": "Feb 23", "product": "Inverters", "sales": 2108 },
      { "date": "Mar 23", "product": "SolarPanels", "sales": 3322},
      { "date": "Mar 23", "product": "Inverters", "sales": 2194 },
    ]
  },
  "charts": [
    {
      "id": "ca88ef28-9720-414d-88ba-a7968aae6b8b",
      "title": "Total Sales by Product",
      "description": "Total sales of solar panels and inverters in Q1 2023.",
      "data": [
        { "product": "SolarPanels", "sales": 8968 },
        { "product": "Inverters", "sales": 6635 }
      ],
      "config": {
        "type": "bar",
        "x_axis": "product",
        "y_axis": "sales",
        "series": null,
        "aggregation": "sum",
        "index": "product",
        "x_axis_label": "Product",
        "start_end_only": false,
        "categories": ["sales"],
        "y_axis_label": "Total Sales",
        "bar_type": "default",
        "layout": "horizontal",
      },
    },
    {
      "id": "3f5b3f60-3e7d-4d85-9b7a-8a3a6a7173b0",
      "title": "Sales Trend Over Time",
      "description": "Monthly sales trends for solar panels and inverters in Q1 2023.",
      "data": [
        { "date": "Jan 23", "SolarPanels": 2890, "Inverters": 2338 },
        { "date": "Feb 23", "SolarPanels": 2756, "Inverters": 2103 },
        { "date": "Mar 23", "SolarPanels": 3322, "Inverters": 2194 }
      ],
      "config": {
        "type": "bar",
        "x_axis": "date",
        "y_axis": "sales",
        "series": "product",
        "aggregation": "none",
        "index": "date",
        "x_axis_label": "Month",
        "start_end_only": false,
        "categories": ["SolarPanels", "Inverters"],
        "y_axis_label": "Sales",
        "layout": "horizontal",
      },
    },
    {
      "id": "4cede2ee-31d8-4cf0-ae5c-495676a6403a",
      "title": "Sales Trend Over Time",
      "description": "Monthly sales trends for solar panels and inverters in Q1 2023.",
      "data": [
        { "date": "Jan 23", "SolarPanels": 2890, "Inverters": 2338 },
        { "date": "Feb 23", "SolarPanels": 2756, "Inverters": 2103 },
        { "date": "Mar 23", "SolarPanels": 3322, "Inverters": 2194 }
      ],
      "config": {
        "type": "line",
        "x_axis": "date",
        "y_axis": "sales",
        "series": "product",
        "aggregation": "none",
        "index": "date",
        "x_axis_label": "Month",
        "start_end_only": false,
        "categories": ["SolarPanels", "Inverters"],
        "y_axis_label": "Sales",
      },
    },
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "title": "Total Sales by Product",
      "description": "Total sales of solar panels and inverters in Q1 2023.",
      "data": [
        { "product": "SolarPanels", "sales": 8968 },
        { "product": "Inverters", "sales": 6635 }
      ],
      "config": {
        "type": "line",
        "x_axis": "product",
        "y_axis": "sales",
        "series": null,
        "aggregation": "sum",
        "index": "product",
        "x_axis_label": "Product",
        "start_end_only": false,
        "categories": ["sales"],
        "y_axis_label": "Total Sales",
        "bar_type": "default",
      },
    }
  ]
}

export { dashboard_list, view_dashboard, edit_dashboard };