import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../../App.css';   
import './RegisterForm.css'

export default function RegisterForm() {



    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [doublePassword, setDoublePassword] = useState('');


    // Проверяет одинаковы ли пароли
    function checkPassword(){
        if(password === ''){
            alert("Вы не ввели пароль!")
            return false;
        } else if(doublePassword === ''){
            alert("Вы не повторили пароль!")
            return false;
        } else{
            if(password === doublePassword){
                return true;
            } else{
                alert("Пароли не совпадают")
                return false;
            }
        }
    }

    
// В будущем для безопасных паролей
    // const weakPasswords = [
    //     '123456',
    //     '1234567',
    //     '12345678', 
    //     '123456789', 
    //     '1234567890', 
    //     '111111',
    //     '222222', 
    //     '000000', 
    //     'qwerty', 
    //     'qwerty1',
    //     '1111111',
    //     '11111111',
    //     'qwerty123',
    //     'qqqqqq'
    // ]


    // Проверка на минимальные значения
    function minValue(){
        if(username.length >= 8){
            if(password.length >= 6){
                if(doublePassword.length >= 6){
                    if(firstName.length >= 4){
                        if(lastName.length >= 4){
                            return true;
                        } else{
                            alert('Фамилия не может быть короче 4 символов!')
                            return false;
                        }
                    } else{
                        alert('Имя не может быть короче 4 символов!')
                        return false;
                    }
                } else{
                    alert('Повтор пароля не может быть короче 6 символов!')
                    return false;
                }
            } else{
                alert('Пароль не может быть короче 6 символов!')
                return false;
            }
        } else{
            alert('Юзернейм не может быть короче 8 символов!')
            return false;
        }
    }


    // Проверяет на максимальные значения
    function maxValue(){
        if(username.length <= 20){
            if(firstName.length <= 20){
                if(lastName.length <= 20){
                    if(password.length <= 20){
                        if(doublePassword.length <= 20 ){
                            return true;
                        }
                    } else{
                        alert('Пароль не может быть длинне 20 символов!')
                        return false;
                    }
                } else{
                    alert('Фамилия не может быть длинне 20 символов!')
                    return false;
                }
            } else{
                alert('Имя не может быть длинне 20 символов!')
                return false;
            }
        } else{
            alert('Юзернейм не может быть длиннее 20 символов!')
            return false;
        }
    }




    // Вызов и проверка всех функций
    function allFunc() {
    const results = {
        password: checkPassword(),
        min: minValue(),
        max: maxValue()
    };
    
    console.log('checkPassword вернула:', results.password);
    console.log('minValue вернула:', results.min);
    console.log('maxValue вернула:', results.max);
    
    if (results.password === true && results.max === true && results.min === true) {
        console.log('Вход выполнен без ошибок')
        console.log('Вход выполнен без ошибок')
        console.log('Вход выполнен без ошибок')
        console.log('Вход выполнен без ошибок')
        console.log('Вход выполнен без ошибок')
        console.log('Вход выполнен без ошибок')
        console.log('Вход выполнен без ошибок')
        console.log('Вход выполнен без ошибок')
        console.log('Вход выполнен без ошибок')
        console.log('Вход выполнен без ошибок')
        console.log('Вход выполнен без ошибок')
    } else{
        console.log('Имеются ошибки')
    }
}




    // function a(){
    //     console.log(
    //         username,
    //         lastName,
    //         firstName,
    //         password,
    //         doublePassword
    //     )
    // }

    return (
    <form className='form'>
        <div className='text'>Регистрация</div>

        <div className="countainer">
            <p>Имя пользователя</p>
            <input min='6' max='20' type="text" placeholder='Имя пользователя' className='startInput username' value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="countainer">
            <p>Имя</p>
            <input type="text" placeholder='Иван' className='startInput firstName' value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
        </div>

        <div className="countainer">
            <p>Фамилия</p>
            <input type="text" placeholder='Иванов' className='startInput lastName' value={lastName} onChange={(e) => setLastName(e.target.value)}/>
        </div>

        <div className="countainer">
            <p>Пароль</p>
            <input type="text" placeholder='Пароль' className='startInput password' value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>

        <div className="countainer">
            <p>Повторите пароль</p>
            <input type="text" placeholder='Повторите пароль' className='startInput doublePassword' value={doublePassword} onChange={(e) => setDoublePassword(e.target.value)} />
        </div>

        <button 
            className='startButton'
            onClick={allFunc}
            type='button'
        >Регистрация</button>
        <div className="source">
            <Link to="/login" className='textSource' style={{ cursor: 'pointer' }}>
                Есть аккаунт? Вход
            </Link>
        </div>
    </form>
);
}