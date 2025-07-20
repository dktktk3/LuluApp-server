import ForegroundService from '@supersami/rn-foreground-service';

export async function startForegroundService() {
  await ForegroundService.start({
    id: 3456,
    title: 'AI.LulluApp 자동매매 실행 중',
    message: '자동매매 봇이 백그라운드에서 작동 중입니다.',
  });
}

export async function stopForegroundService() {
  await ForegroundService.stop();
}