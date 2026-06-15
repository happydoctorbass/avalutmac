'use client';

import { useCasinoMatches } from '../hooks/useCasinoMatches';
import { AdminGuard } from './components/AdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SettingsCard } from './components/SettingsCard';
import { MatchForm } from './components/MatchForm';
import { MatchList } from './components/MatchList';
import { UpcomingMatchesCard } from './components/UpcomingMatchesCard';
import { CarouselControls } from './components/CarouselControls';
import { TableDisplaySettingsCard } from './components/TableDisplaySettingsCard';
import { SlidersHorizontal, Clapperboard, PlusCircle, CalendarClock, ListOrdered, Monitor } from 'lucide-react';

export default function CasinoAdminPage() {
  const {
    matches,
    focusMatchId,
    settings,
    addMatch,
    addMatchesUnique,
    removeMatch,
    setFocus,
    updateMatch,
    updateSettings,
    nextCard,
    prevCard,
  } = useCasinoMatches();

  const matchCount = matches.length;

  return (
    <AdminGuard>
      <div className="mx-auto max-w-5xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <img src="/logo/admiral.svg" alt="Admiral Casino" className="h-12 w-auto drop-shadow-[0_0_14px_rgba(245,158,11,0.25)]" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admiral Casino</h1>
              <p className="text-sm text-muted-foreground">Управление матчами и табло.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-muted/30 px-4 py-2 text-sm">
            <span className="font-semibold text-amber-500">{matchCount}</span>
            <span className="text-muted-foreground">{matchCount === 1 ? 'матч' : 'матчей'} в эфире</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-amber-500" />
              Настройки экрана
            </CardTitle>
            <CardDescription>Количество карточек, масштаб и интервал авто-смены.</CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsCard settings={settings} onChange={updateSettings} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-amber-500" />
              Настройки табло (таблица)
            </CardTitle>
            <CardDescription>
              Колонки, шрифты, флаги, главный блок и пагинация для /casino-display-table.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TableDisplaySettingsCard settings={settings} onChange={updateSettings} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clapperboard className="h-5 w-5 text-amber-500" />
              Управление каруселью
            </CardTitle>
            <CardDescription>Листайте вручную и ставьте на стоп.</CardDescription>
          </CardHeader>
          <CardContent>
            <CarouselControls
              onPrev={prevCard}
              onNext={nextCard}
              isPlaying={settings.autoRotate}
              onToggle={() => updateSettings({ ...settings, autoRotate: !settings.autoRotate })}
              disabled={matchCount < 2}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-amber-500" />
              Добавить матч
            </CardTitle>
            <CardDescription>Ручной ввод (команды, дата/время, спорт).</CardDescription>
          </CardHeader>
          <CardContent>
            <MatchForm onAdd={addMatch} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-amber-500" />
              Предстоящие матчи
            </CardTitle>
            <CardDescription>Матчи чемпионата — добавьте все сразу или по одному.</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingMatchesCard onAdd={addMatchesUnique} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListOrdered className="h-5 w-5 text-amber-500" />
              Список матчей
            </CardTitle>
            <CardDescription>Удаляйте, выводите в центр, задавайте счёт и редактируйте прямо тут.</CardDescription>
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