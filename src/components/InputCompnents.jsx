function TextInput({ key_name, value, handleChangeFunction }) {
  return (
    <input
      className="form-control text-dark ms-2 me-2"
      type="text"
      id={key_name}
      onChange={handleChangeFunction}
      value={value}
      style={{ width: "16rem" }}
    />
  );
}

function DateInput({ key_name, value, handleChangeFunction }) {
  return (
    <input
      className="form-control ms-2 me-2"
      type="date"
      id={key_name}
      onChange={handleChangeFunction}
      defaultValue={value ? value.split("T")[0] : ""}
      style={{ width: "10rem" }}
    />
  );
}

export { TextInput, DateInput };
