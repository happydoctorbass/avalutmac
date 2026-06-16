'use client';

import { useCasinoMatches } from '../hooks/useCasinoMatches';
import { AdminGuard } from './components/AdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TableDisplaySettingsCard } from './components/TableDisplaySettingsCard';
import { MatchCatalogTable } from './components/MatchCatalogTable';
import { Button } from '@/components/ui/button';
import { ExternalLink, Monitor, TableProperties } from 'lucide-react';

export default function CasinoAdminPage() {
  const {
    matches,
    settings,
    updateSettings,
    isHydrated,
    addMatch,
    removeMatch,
    addMatchesUnique,
    clearMatches,
  } = useCasinoMatches();

  return (
    <AdminGuard>
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <img src="/logo/admiral.svg" alt="Admiral Casino" className="h-12 w-auto" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admiral Casino — Админка</h1>
              <p className="text-sm text-muted-foreground">
                Управление табло <code className="text-amber-500">/casino-display-table</code>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border bg-muted/30 px-4 py-2 text-sm">
              <span className="font-semibold text-amber-500">{matches.length}</span>
              <span className="text-muted-foreground">на табло</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => window.open('/casino-display-table', '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              Открыть табло
            </Button>
          </div>
        </div>

        {!isHydrated && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Загрузка состояния табло с сервера…
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-amber-500" />
              Настройки табло
            </CardTitle>
            <CardDescription>
              Колонки, шрифты, флаги, главный блок, пагинация и автозаполнение строк.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TableDisplaySettingsCard
              settings={settings}
              onChange={updateSettings}
              disabled={!isHydrated}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TableProperties className="h-5 w-5 text-amber-500" />
              Матчи на табло
            </CardTitle>
            <CardDescription>
              Только предстоящие и live-матчи. Прошедшие автоматически убираются.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MatchCatalogTable
              boardMatches={matches}
              onAdd={addMatch}
              onRemove={removeMatch}
              onAddMany={addMatchesUnique}
              onClear={clearMatches}
            />
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  );
}
