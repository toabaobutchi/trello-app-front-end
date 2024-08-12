function TableHeader({ items }: { items: React.ReactNode[] }) {
  return (
    <>
      <thead>
        <tr>
          {/* <th>
            <input type='checkbox' className="table-option-checkbox" name='table-check-all' id='table-check-all' value='all' />
          </th> */}
          {items.map((item, index) => (
            <th key={index}>{item}</th>
          ))}
        </tr>
      </thead>
    </>
  )
}

export default TableHeader
