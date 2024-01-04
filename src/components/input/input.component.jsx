export const InputBox = (props) =>{
    const {onChangeFunc, type, id, name, val, label, placeholder} = props;

    return(
    <>
        <label className="block text-gray-600">{label}</label>
        <input onChange={onChangeFunc} value={val} id={id} name={name} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" type = {type} placeholder= {placeholder}/>
    </>
    );
}