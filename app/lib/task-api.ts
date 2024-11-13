export type Task = {
  id: string;
  description: string;
  isComplete: boolean;
  dueDate: string | null;
};

export type Tasks = Task[];

export async function updateTask(
  taskId: string,
  isComplete: boolean
): Promise<{ success: boolean }> {
  // Send the PATCH request to the API
  try {
    const response = await fetch(
      `https://b0f179aa-a791-47b5-a7ca-5585ba9e3642.mock.pstmn.io/patch/${taskId}`,
      {
        method: "PATCH",
        headers: {
          "X-Api-Key":
            "PMAK-65a6d95a73d7f315b0b3ae13-28f9a3fada28cc91e0990b112478319641",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isComplete: isComplete }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    const data = await response.json();
    if (data.status === "success") {
      console.log("Task updated successfully", data);
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false };
  }
}

export async function getTasks(): Promise<Tasks> {
  try {
    const response = await fetch(
      "https://b0f179aa-a791-47b5-a7ca-5585ba9e3642.mock.pstmn.io/get",
      {
        headers: {
          "X-Api-Key":
            "PMAK-65a6d95a73d7f315b0b3ae13-28f9a3fada28cc91e0990b112478319641",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch todos");
    }

    const tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}
