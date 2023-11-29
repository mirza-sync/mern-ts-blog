import express from 'express';
import controller from '../controllers/blog';

const router = express.Router();

router.post('/create', controller.create);
router.get('/:blogId', controller.read);
router.get('/query', controller.query);
router.patch('/update/:blogId', controller.update);
router.post('/:blogId', controller.deleteBlog);
router.get('/', controller.readAll);

export = router;
