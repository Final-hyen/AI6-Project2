import React, { useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { api } from '../utils/customAxios';
import Cookie from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface FormValue {
    nickname: string | undefined;
    password: string;
    confirmPassword: string;
    gender: string;
    birthDate: string;
}

function MyPage() {
    const navigate = useNavigate();

    const token = localStorage.getItem('accessToken');
    if (!token) window.location.replace('/');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { year, month, day } = user.birthDate;
    const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(
        day
    ).padStart(2, '0')}`;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormValue>({
        defaultValues: {
            nickname: user.nickname,
            password: '',
            confirmPassword: '',
            gender: user.gender,
            birthDate: birthDate,
        },
    });

    // 비밀번호와 비밀번호 확인이 일치하는지 검증하기 위해 "password" input 의 value 를 추적함
    const passwordRef = useRef<string | null>(null);
    passwordRef.current = watch('password');

    const onSubmitHandler: SubmitHandler<FormValue> = async (data) => {
        if (data.nickname === user.nickname) data.nickname = undefined;
        if (window.confirm('회원정보를 수정하시겠습니까?')) {
            await api.put(`/api/users/${user.id}`, data);

            user.nickname = data.nickname;
            localStorage.setItem('user', JSON.stringify(user));

            alert('정상적으로 수정되었습니다.');
            navigate('/');
        }
    };

    const onClickHandler = async () => {
        if (window.confirm('회원을 탈퇴하시겠습니까?')) {
            await api.delete(`/api/users/${user.id}`);

            localStorage.removeItem('user');
            localStorage.removeItem('expireAt');
            localStorage.removeItem('accessToken');
            Cookie.remove('refreshToken');
            delete axios.defaults.headers.common['Authorization'];

            alert('정상적으로 탈퇴되었습니다.');
            navigate('/');
        }
    };

    return (
        <>
            <div className='px-14 py-10 w-4/12 mx-auto mt-[10rem] mb-16 border-solid border border-gray-800/10 rounded-3xl shadow-2xl'>
                <div className='bg-gray-600 h-[120px] -mt-10 mb-5 -mx-14 rounded-t-3xl flex justify-center items-center flex-col'>
                    <p className='text-white text-center text-lg'>
                        {user.nickname}
                    </p>
                    <p className='text-white text-center'>{user.email}</p>
                </div>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
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
                            htmlFor='gender'
                            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                        >
                            gender
                        </label>

                        <div className='flex items-center mb-4'>
                            <div className='w-1/2 flex'>
                                <input
                                    {...register('gender', {})}
                                    id='country-option-1'
                                    type='radio'
                                    name='gender'
                                    value='male'
                                    className='self-center w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600'
                                    disabled
                                />
                                <label
                                    htmlFor='country-option-1'
                                    className='block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                                >
                                    남자
                                </label>
                            </div>
                            <input
                                {...register('gender', {})}
                                id='country-option-2'
                                type='radio'
                                name='gender'
                                value='female'
                                className='w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600'
                                disabled
                            />
                            <label
                                htmlFor='country-option-2'
                                className='block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                            >
                                여자
                            </label>
                        </div>
                    </div>
                    <div className='mb-6'>
                        <label
                            htmlFor='birthdate'
                            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                        >
                            birthdate
                        </label>
                        <input
                            {...register('birthDate', {})}
                            type='date'
                            id='birthdate'
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                            required
                            disabled
                        />
                    </div>
                    <div className='flex flex-col justify-between'>
                        <button
                            type='submit'
                            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                        >
                            수정
                        </button>
                    </div>
                    <div className='mt-3 flex flex-col justify-between'>
                        <button
                            type='button'
                            onClick={onClickHandler}
                            className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                        >
                            회원탈퇴
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default MyPage;
