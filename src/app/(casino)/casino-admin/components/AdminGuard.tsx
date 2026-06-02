'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const CORRECT_PASSWORD = 'casino777';

  useEffect(() => {
    const isAuth = localStorage.getItem('casino_access') === 'true';
    setIsAuthenticated(isAuth);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem('casino_access', 'true');
      setIsAuthenticated(true);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Admiral Casino Admin</CardTitle>
          <CardDescription>Введите пароль для доступа</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Пароль"
              autoFocus
            />
            {error && <p className="text-destructive text-sm">Неверный пароль</p>}
            <Button className="w-full" type="submit">Войти</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
