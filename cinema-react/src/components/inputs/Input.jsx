function Input({
  id,
  tipo = 'text',
  label,
  valor,
  onChange,
  placeholder = '',
  obrigatorio = false,
  desabilitado = false,
  variant = ""
}) {
  const isFloating = variant === "form-floating";

  return (
    <div className={isFloating ? 'form-floating mb-3' : 'mb-4'}>

      {/* fora do form-floating, label separado */}
      {!isFloating && label && (
        <label className="form-label mt-1" htmlFor={id}>{label}</label>
      )}
      
      <input
        type={tipo}
        className="form-control form-control-sm"
        id={id}
        placeholder={isFloating ? placeholder || label : placeholder} // necessário para form-floating
        value={valor}
        onChange={onChange}
        required={obrigatorio}
        disabled={desabilitado}
      />
      
      {/* label só dentro do form-floating */}
      {isFloating && (
        <label htmlFor={id}>{label}</label>
      )}
      
    </div>
  );
}

export default Input;
