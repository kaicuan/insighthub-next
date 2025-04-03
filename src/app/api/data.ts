import { dashboard_list, view_dashboard, edit_dashboard } from "@/app/api/mock-data";

export async function fetchViewDashboardList() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const data = dashboard_list;
    return data;

  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch dashboard list.');
  }
}

export async function fetchViewDashboard() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const data = view_dashboard;
    return data;

  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch dahsboard data');
  }
}

export async function fetchEditDashboard() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const data = edit_dashboard;
    return data;

  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch dahsboard data.');
  }
}