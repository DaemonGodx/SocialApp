function normalizeCursor(rawCursor) {
  if (!rawCursor) return null;

  try {
    // Basic shape validation
    if (!rawCursor.createdAt || !rawCursor._id) {
      return null;
    }

    const createdAt = new Date(rawCursor.createdAt);

    // If invalid date, ignore cursor
    if (isNaN(createdAt.getTime())) {
      return null;
    }

    return {
      createdAt,
      _id: rawCursor._id.toString(),
    };
  } catch (e) {
    return null; // fail safe
  }
}
export {normalizeCursor}
