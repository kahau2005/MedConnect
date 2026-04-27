export const DropdownSpecialtyItemMapper = (rawData) => {
  return rawData.map((item) => ({
    label: item.name,
    value: item.id.toString(),
  }));
};

export const DropdownDoctorItemMapper = (rawData) => {
  return rawData.map((item) => ({
    label: `${item.last_name} ${item.first_name}`,
    value: item.user_id.toString(),
  }));
};
