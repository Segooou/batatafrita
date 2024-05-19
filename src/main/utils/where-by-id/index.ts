export const whereById = (
  id: number | string
): { AND: { finishedAt: null; id: number }; id: number } => ({
  AND: {
    finishedAt: null,
    id: Number(id)
  },
  id: Number(id)
});
