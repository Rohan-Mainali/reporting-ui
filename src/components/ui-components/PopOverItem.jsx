export const PopOverItem = ({ title, description, date }) => {
  return (
    <div style={{ maxWidth: '300px' }}>
      <h2 style={{ margin: '0px', padding: '0px', fontWeight: '500', fontSize: '18px' }}>{title}</h2>
      <p style={{ fontSize: '14px', margin: '0px' }}>{description}</p>
    </div>
  )
}

