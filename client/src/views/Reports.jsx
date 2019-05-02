import React, { Fragment, Component } from 'react';
import Axios from 'axios';
import TimeAgo from 'react-timeago';
import spanishStrings from 'react-timeago/lib/language-strings/es';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
const formatter = buildFormatter(spanishStrings);

export default class Reports extends Component {
    constructor() {
        super();

        this.state = {
            reports: [],
            error: false,
            reportPerPage: 10,
            tab: "0"
        }
    }

    componentWillMount() {
        this._loadReports();
    }

    _loadReports() {
        Axios.get(`http://localhost:8000/api/reports/?index=${Number(this.state.tab)}`)
            .then((res) => {
                const nextReports = res.data.reports.map(report => ({
                    _id: report._id,
                    resolved: report.resolved,
                    sentBy: report.sentBy,
                    reason: report.reason,
                    createdAt: report.createdAt
                }));

                this.setState({
                    reports: [...nextReports],
                    totalReports: res.data.count
                });
            }).catch((err) => {
                this.setState({
                    error: err.message
                });
            });
    }

    _handleClick(e) {
        this.setState({
            counter: e.target.id * 10,
            currentPage: Number(e.target.id)
        }, () => {
            this._loadReports();
        });
    }

    _handleReport(id) {
        Axios.put(`http://localhost:8000/api/report/${id}`)
            .then(() => {
                this._loadReports();
            })
    }

    _handleTabs(e) {
        this.setState({ tab: e.target.id });
    }

    render() {

        const { error, reports, totalReports, reportPerPage } = this.state;

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(totalReports / reportPerPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(n => {
            return (<li key={n - 1} id={n - 1} onClick={this._handleClick.bind(this)} > {n}</li >)
        });

        return (
            <div className="ReportList">
                {reports.map(report => (
                    <Fragment>
                        <div key={report._id} className="Report">
                            <div className='decorator'></div>
                            <div className='column column-60'>
                                <h4>{report.reason}</h4>
                                <small><TimeAgo date={report.createdAt} formatter={formatter} /></small>
                            </div>
                        </div>
                    </Fragment>
                ))}

                {error &&
                    <div style={{ color: '#900' }}>
                        {error}
                    </div>
                }
                <ul id="paginator">
                    {renderPageNumbers}
                </ul>
            </div>
        )
    }
}



