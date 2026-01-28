import { RouterProvider } from 'react-router-dom';
import { DeviceStoreProvider } from './store/deviceStore';
import { router } from './router';

export default function App() {
  return (
    <DeviceStoreProvider>
      <RouterProvider router={router} />
    </DeviceStoreProvider>
  );
}
