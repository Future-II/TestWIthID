import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './shared/components/Layout/Layout';
import { TaqeemAuthProvider } from './shared/context/TaqeemAuthContext';
import { SocketProvider } from './shared/context/SocketContext';
import { ProgressProvider } from './shared/context/ProgressContext';

import TaqeemLoginTest from './features/Testing/pages/TaqeemLoginTest';
import WithIDExcelTest from './features/Testing/pages/WithIDExcelTest';
import AssetCreate from './features/Testing/pages/AssetCreate';
import DeleteReport from './features/Testing/pages/DeleteReport';
import GrabMacroIds from './features/Testing/pages/GrabMacroIds';
import UpdateReportWithExcel from './features/Testing/pages/UpdateReportWithExcel';

export function App() {
  return (
    <TaqeemAuthProvider>
      <SocketProvider>
        <ProgressProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<TaqeemLoginTest />} />
                <Route path="/testing/with-id" element={<WithIDExcelTest />} />
                <Route path="/testing/asset-create" element={<AssetCreate />} />
                <Route path='/testing/delete-report' element={<DeleteReport />} />
                <Route path="/testing/grab-macro-ids" element={<GrabMacroIds />} />
                <Route path="/testing/excel-upload" element={<UpdateReportWithExcel />} />
              </Routes>
            </Layout>
          </Router>
        </ProgressProvider>
      </SocketProvider>
    </TaqeemAuthProvider>
  );
}