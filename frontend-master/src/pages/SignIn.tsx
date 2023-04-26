import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { api } from '../utils/customAxios';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import { AxiosError } from 'axios';

interface FormValue {
    email: string;
    password: string;
}

function SignIn() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();

    const navigate = useNavigate();

    const onSubmitHandler: SubmitHandler<FormValue> = async (data) => {
        const token = await api.post('/api/users/login', data);
        if (token.status === 200) {
            const { accessToken, refreshToken } = token.data.data;

            setAuthorizationToken(accessToken, refreshToken);
            navigate('/');

            const user = await api.post('/api/users/user');
            localStorage.setItem('user', JSON.stringify(user.data.data));
        }
    };

    return (
        <>
            <div className='px-14 py-10 w-4/12 mx-auto mt-[10rem] mb-16 border-solid border border-gray-800/10 rounded-3xl shadow-2xl'>
                <img
                    src='logo.png'
                    className='w-[50%] mx-auto'
                    alt='Logo'
                />
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className='mb-6'>
                        <label
                            htmlFor='email'
                            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                        >
                            email
                        </label>
                        <input
                            {...register('email', {
                                required: true,
                            })}
                            type='text'
                            id='email'
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                            placeholder='name@osondoson.com'
                        />
                        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            <span className='font-bold'>
                                {errors.email?.type === 'required' &&
                                    '이메일을 입력해주세요!'}
                            </span>
                        </p>
                    </div>
                    <div className='mb-6'>
                        <label
                            htmlFor='password'
                            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                        >
                            password
                        </label>
                        <input
                            {...register('password', {
                                required: true,
                            })}
                            type='password'
                            id='password'
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        />
                        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            <span className='font-bold'>
                                {errors.password?.type === 'required' &&
                                    '비밀번호를 입력해주세요!'}
                            </span>
                        </p>
                    </div>
                    {/* <div className='flex items-start mb-6'>
                        <div className='flex items-center h-5'>
                            <input
                                id='remember'
                                type='checkbox'
                                value=''
                                className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800'
                                required
                            />
                        </div>
                        <label
                            htmlFor='remember'
                            className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                        >
                            Remember me
                        </label>
                    </div> */}
                    <div className='flex flex-col justify-between'>
                        <button
                            type='submit'
                            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                        >
                            로그인
                        </button>
                        <Link to='/sign-up'>
                            <button
                                type='button'
                                className='mt-3 text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                            >
                                회원가입
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

export default SignIn;
