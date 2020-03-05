class FileController {
  async store(req, res) {
    return res.json({ message: 'ok' });
  }
}

export default new FileController();
