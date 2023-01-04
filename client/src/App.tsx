import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/pages/SignUp';
import Login from './components/pages/Login';
import User from './components/pages/User';

import Container from './components/layout/Container';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import PrivateRoutes from './components/pages/utils/PrivateRoutes';

function App() {
  return (
    <Router>
      <ul>
        <Navbar />
      </ul>
      <Container customClass="min-height">
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/user" element={<User />} />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
