import { Router } from 'express';
import { addUser, getUserDetails, getUsersByOrgId, updateUser, deleteUser, getAllUsers,register, login , validateToken} from '../controller/userController';

const router = Router();

router.post('/', addUser);
router.get('/get/:id', getUserDetails);
router.put('/get/:id', updateUser);
router.delete('/get/:id', deleteUser);
router.get('/', getAllUsers);
router.post('/register', register);
router.post('/login', login);
router.get('/validateToken', validateToken);
router.get('/org/:orgId', getUsersByOrgId)

export default router;
