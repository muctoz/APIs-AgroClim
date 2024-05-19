module.exports = {
  async healthCheck(req, res) {
    try {
      return await res.status(200).json({ status: 'OK' });
    } catch (error) {
      return await res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};