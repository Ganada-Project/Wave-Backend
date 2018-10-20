const query = require("../common/query");

exports.getStyleById = async (req, res) => {
    const {style_id} = req.params;
    try {
        const result = await query.style.getStyleById(style_id);
        return res.status(200).json({
            result
        })
    } catch (err) {
        return res.status(400).json(err);
    }
};

exports.getAllStyles = async (req, res) => {
    try {
        const result = await query.style.getAllStyles();
        return res.status(200).json({
            result
        })
    } catch (err) {
        return res.status(400).json(err);
    }
}