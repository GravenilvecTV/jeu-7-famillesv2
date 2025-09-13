import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './config/queryClient';
import { GameContainer } from './features/game/GameContainer';
import './App.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameContainer />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;