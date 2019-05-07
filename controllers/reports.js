const Report = require('../models/Report');
const _ = require('underscore');

module.exports = {
    // Lista todos los reportes
    index: (req, res) => {
        let index = req.query.index || 0;
        index = Number(index);

        let limit = req.query.limit || 10;
        limit = Number(limit);

        Report.find({ resolved: false })
            .skip(index)
            .limit(limit)
            .exec((err, reports) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Report.count((err, count) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        reports,
                        count
                    });
                });
            });
    },

    // Lista un reporte específico
    show: (req, res) => {
        Report.findById(req.params.id, (err, report) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json(report);
        })
    },

    // Crea un reporte
    create: (req, res) => {
        let body = req.body;

        let report = new Report({
            sentBy: req.userInfo._id,
            reportedId: body.reportedId,
            reason: body.reason,
        });

        report.save((err, report) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                report
            });
        });
    },

    // Actualiza un reporte
    update: (req, res) => {
        let body = _.pick(req.body, ['resolved']);

        Report.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true }, (err, report) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!report) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe ese reporte'
                    }
                });
            }

            res.json({
                ok: true,
                report
            });
        });
    }
}