import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { customAxios } from '../utils/customAxios';

interface FormValue {
    email: string;
    password: string;
    confirmPassword: string;
    nickname: string;
    gender: string;
    birthDateOrg: string;
    birthDate: { year: number; month: number; day: number };
}

function SignUp() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormValue>();

    const navigate = useNavigate();

    // 비밀번호와 비밀번호 확인이 일치하는지 검증하기 위해 "password" input 의 value 를 추적함
    const passwordRef = useRef<string | null>(null);
    passwordRef.current = watch('password');

    const onSubmitHandler: SubmitHandler<FormValue> = (data) => {
        const [year, month, day]: number[] = data.birthDateOrg
            .split('-')
            .map((e) => Number(e));

        data.birthDate = { year: year, month: month, day: day };

        customAxios
            .post('/api/users/register', data)
            .then((response) => response.data)
            .then((data) => {
                if (data.data === 'OK') {
                    alert('정상적으로 가입되었습니다.');
                    navigate('/sign-in');
                }
            })
            .catch((error) => {
                alert(error.response.data.errorMessage);
            });
    };

    return (
        <>
            <div className='px-14 py-10 w-4/12 mx-auto mt-[10rem] mb-16 border-solid border border-gray-800/10 rounded-3xl shadow-2xl'>
                <img src='logo.png' className='w-[50%] mx-auto' alt='Logo' />
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
                                maxLength: 15,
                                pattern: /^\S+@\S+$/i,
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
                                {errors.email?.type === 'maxLength' &&
                                    '최대 15자만 입력할 수 있습니다!'}
                                {errors.email?.type === 'pattern' &&
                                    '이메일 양식이 올바르지 않습니다!'}
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
                                minLength: 8,
                                maxLength: 20,
                            })}
                            type='password'
                            id='password'
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        />
                        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            <span className='font-bold'>
                                {errors.password?.type === 'required' &&
                                    '비밀번호를 입력해주세요!'}
                                {errors.password?.type === 'minLength' &&
                                    '최소 8자부터 입력할 수 있습니다!'}
                                {errors.password?.type === 'maxLength' &&
                                    '최대 20자까지 입력할 수 있습니다!'}
                            </span>
                        </p>
                    </div>
                    <div className='mb-6'>
                        <label
                            htmlFor='confirmPassword'
                            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                        >
                            confirm password
                        </label>
                        <input
                            {...register('confirmPassword', {
                                validate: (value) =>
                                    value === passwordRef.current,
                            })}
                            type='password'
                            id='confirmPassword'
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        />
                        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            <span className='font-bold'>
                                {errors.confirmPassword?.type === 'validate' &&
                                    '비밀번호가 일치하지 않습니다.'}
                            </span>
                        </p>
                    </div>
                    <div className='mb-6'>
                        <label
                            htmlFor='nickname'
                            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                        >
                            nickname
                        </label>
                        <input
                            {...register('nickname', {
                                required: true,
                                maxLength: 15,
                            })}
                            type='text'
                            id='nickname'
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        />
                        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            <span className='font-bold'>
                                {errors.nickname?.type === 'required' &&
                                    '닉네임을 입력해주세요!'}
                                {errors.nickname?.type === 'maxLength' &&
                                    '최대 15자까지 입력할 수 있습니다!'}
                            </span>
                        </p>
                    </div>
                    <div className='mb-6'>
                        <label
                            htmlFor='gender'
                            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                        >
                            gender
                        </label>
                        <div className='flex items-center mb-4'>
                            <div className='w-1/2 flex'>
                                <input
                                    {...register('gender', {
                                        required: false,
                                    })}
                                    id='male'
                                    type='radio'
                                    name='gender'
                                    value='male'
                                    className='self-center w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600'
                                    defaultChecked
                                />
                                <label
                                    htmlFor='male'
                                    className='block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                                >
                                    남자
                                </label>
                            </div>
                            <div className='flex'>
                                <input
                                    {...register('gender', {
                                        required: false,
                                    })}
                                    id='female'
                                    type='radio'
                                    name='gender'
                                    value='female'
                                    className='self-center w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600'
                                />
                                <label
                                    htmlFor='female'
                                    className='block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                                >
                                    여자
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='mb-6'>
                        <label
                            htmlFor='birthDateOrg'
                            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                        >
                            birthDate
                        </label>
                        <input
                            {...register('birthDateOrg', {
                                required: true,
                            })}
                            type='date'
                            id='birthDateOrg'
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        />

                        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            <span className='font-bold'>
                                {errors.birthDateOrg?.type === 'required' &&
                                    '생년월일을 입력해주세요!'}
                            </span>
                        </p>
                    </div>
                    <div className='flex flex-col justify-between'>
                        <button
                            type='submit'
                            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                        >
                            가입
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default SignUp;
