import React, { useState } from 'react';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (name: string, email: string, password: string) => Promise<boolean>;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }> = ({ label, error, ...props }) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    <input
      {...props}
      className={`w-full p-2.5 bg-slate-700 border ${error ? 'border-red-500' : 'border-slate-600'} rounded-md text-slate-100 focus:ring-sky-500 focus:border-sky-500 transition-colors`}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegister }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');


  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError('E-mail e senha são obrigatórios.');
      return;
    }
    const success = await onLogin(loginEmail, loginPassword);
    if (!success) {
      setLoginError('E-mail ou senha inválidos.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    if (!registerName || !registerEmail || !registerPassword || !confirmPassword) {
      setRegisterError('Todos os campos são obrigatórios.');
      return;
    }
    if (registerPassword !== confirmPassword) {
      setRegisterError('As senhas não coincidem.');
      return;
    }
    if (registerPassword.length < 6) {
      setRegisterError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    const success = await onRegister(registerName, registerEmail, registerPassword);
    if (success) {
        setRegisterSuccess('Cadastro realizado com sucesso! Você será redirecionado para o login.');
        // Reset fields
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setConfirmPassword('');
        setTimeout(() => {
            setIsRegisterMode(false); // Switch to login mode
            setRegisterSuccess(''); // Clear success message
        }, 2000);
    } else {
      setRegisterError('Este e-mail já está cadastrado ou ocorreu um erro.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-sky-400 mb-6 text-center">
          {isRegisterMode ? 'Criar Conta' : 'Bem-vindo!'}
        </h1>

        {/* Warning message removed from here */}

        {isRegisterMode ? (
          // Registration Form
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <InputField label="Nome Completo" id="reg-name" type="text" value={registerName} onChange={e => setRegisterName(e.target.value)} required />
            <InputField label="E-mail" id="reg-email" type="email" value={registerEmail} onChange={e => setRegisterEmail(e.target.value.toLowerCase())} required />
            <InputField label="Senha (mín. 6 caracteres)" id="reg-password" type="password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required />
            <InputField label="Confirmar Senha" id="reg-confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            
            {registerError && <p className="text-red-400 text-sm text-center">{registerError}</p>}
            {registerSuccess && <p className="text-green-400 text-sm text-center">{registerSuccess}</p>}

            <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition-colors duration-150">
              Cadastrar
            </button>
            <p className="text-sm text-center text-slate-400">
              Já tem uma conta?{' '}
              <button type="button" onClick={() => { setIsRegisterMode(false); setRegisterError(''); setRegisterSuccess(''); }} className="font-medium text-sky-400 hover:text-sky-300">
                Faça Login
              </button>
            </p>
          </form>
        ) : (
          // Login Form
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <InputField label="E-mail" id="login-email" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value.toLowerCase())} required />
            <InputField label="Senha" id="login-password" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
            
            {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}

            <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition-colors duration-150">
              Entrar
            </button>
            <p className="text-sm text-center text-slate-400">
              Não tem uma conta?{' '}
              <button type="button" onClick={() => { setIsRegisterMode(true); setLoginError(''); }} className="font-medium text-sky-400 hover:text-sky-300">
                Cadastre-se
              </button>
            </p>
          </form>
        )}
      </div>
      <footer className="text-center p-4 text-sm text-slate-600 mt-8">
        Visualizador de Chamados &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default LoginPage;