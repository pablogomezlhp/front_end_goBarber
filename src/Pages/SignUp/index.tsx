import React, { useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Content, Background, AnimationContainer } from './styles';

import api from '../../services/apiClient';

import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  console.log(formRef);

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Please Input Your Name'),
          email: Yup.string()
            .required('Please Input Your E-mail')
            .email('Please Input a Valid E-mail'),
          password: Yup.string().min(6, 'At least 6 digits'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);
        history.push('/');

        addToast({
          type: 'success',
          title: 'Account Created',
          description: 'Now you can login',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'info',
          title: 'Error',
          description: 'Error trying to Sign Up.. Please try again.',
        });
      }
    },
    [addToast, history],
  );
  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Create Your Account</h1>
            <Input name="name" icon={FiUser} placeholder="Name" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Password"
            />
            <Button type="submit">Create</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Go back to Login Page
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
