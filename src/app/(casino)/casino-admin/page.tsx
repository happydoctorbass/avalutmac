'use client';

import { useCasinoMatches } from '../hooks/useCasinoMatches';
import { AdminGuard } from './components/AdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SettingsCard } from './components/SettingsCard';
import { MatchForm } from './components/MatchForm';
import { MatchList } from './components/MatchList';
import { TestDataCard } from './components/TestDataCard';

export default function CasinoAdminPage() {
  const { matches, focusMatchId, settings, addMatch, addMatches, removeMatch, setFocus, updateMatch, updateSettings } = useCasinoMatches();

  return (
    <AdminGuard>
      <div className="mx-auto max-w-5xl p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admiral Casino</h1>
          <p className="text-sm text-muted-foreground">Управление матчами и отображением карусели.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Настройки экрана</CardTitle>
            <CardDescription>Количество карточек без лимита и масштаб.</CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsCard settings={settings} onChange={updateSettings} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Добавить матч</CardTitle>
            <CardDescription>Ручной ввод (команды, дата/время, спорт).</CardDescription>
          </CardHeader>
          <CardContent>
            <MatchForm onAdd={addMatch} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Тестовые данные</CardTitle>
            <CardDescription>Сгенерировать случайные матчи и сразу вывести на дисплей.</CardDescription>
          </CardHeader>
          <CardContent>
            <TestDataCard onAdd={addMatches} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Список матчей</CardTitle>
            <CardDescription>Можно удалять, выводить в центр и редактировать прямо тут.</CardDescription>
          </CardHeader>
          <CardContent>
            <MatchList
              matches={matches}
              focusMatchId={focusMatchId}
              onFocus={setFocus}
              onRemove={removeMatch}
              onUpdate={updateMatch}
            />
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  );
}