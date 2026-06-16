'use client';

import { useCasinoMatches } from '../hooks/useCasinoMatches';
import { AdminGuard } from './components/AdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, TableProperties } from 'lucide-react';
import { HARDCODED_MATCHES } from '@/lib/hardcoded-matches';

export default function CasinoAdminPage() {
  const {
    isHydrated,
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
              <span className="font-semibold text-amber-500">{HARDCODED_MATCHES.length}</span>
              <span className="text-muted-foreground">промо-матчей</span>
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
              <TableProperties className="h-5 w-5 text-amber-500" />
              Промо-матчи
            </CardTitle>
            <CardDescription>
              Матчи жестко заданы в коде (hardcoded). Ручное добавление и удаление отключено.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Список матчей загружается автоматически. Чтобы изменить список или призовые фонды, отредактируйте файл <code className="text-amber-500">src/lib/hardcoded-matches.ts</code>.
              </p>
              <div className="grid gap-2">
                {HARDCODED_MATCHES.map((m, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md bg-background px-3 py-2 text-sm border border-border/50">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-muted-foreground w-24">{m.bishkek?.date_bishkek} {m.bishkek?.time_bishkek}</span>
                      <span className="font-bold">{m.team1} vs {m.team2}</span>
                    </div>
                    <span className="font-bold text-amber-500">{m.prize}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  );
}
