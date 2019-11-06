import React, { Component } from 'react';
import { Link } from '@reach/router';
import * as api from '../utils/api';
import ArticleCard from './ArticleCard';
import Login from './Login';
import { JellyfishSpinner } from 'react-spinners-kit';

class ArticlesList extends Component {
  state = {
    articles: [],
    isLoading: true,
    sortBy: 'created_at',
    userLogged: ''
  };
  componentDidMount() {
    let userLogged = '';
    if (localStorage.getItem('username')) {
      userLogged = localStorage.getItem('username');
    }
    api.fetchAllArticles(this.props.topic).then(({ data: { articles } }) => {
      this.setState({ articles, isLoading: false, userLogged });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    const { topic } = this.props;
    const { sortBy } = this.state;
    if (prevProps.topic !== topic || prevState.sortBy !== sortBy) {
      api
        .fetchAllArticles(topic, this.state.sortBy)
        .then(({ data: { articles } }) => {
          this.setState({ articles, isLoading: false });
        });
    }
  }
  handleClick = response => {
    this.setState({ sortBy: response });
  };
  addUsername = userLogged => {
    this.setState({ userLogged }, () => {
      localStorage.setItem('username', userLogged);
    });
  };
  render() {
    const { isLoading, articles, userLogged } = this.state;
    return (
      <>
        {!userLogged && <Login path="/login" addUsername={this.addUsername} />}
        <div className="articles-list">
          <div className="sort-by-filters">
            <button
              onClick={e => {
                this.handleClick('created_at');
              }}
              className="filter-buttons"
            >
              new
            </button>
            <button
              onClick={e => {
                this.handleClick('votes');
              }}
              className="filter-buttons"
            >
              votes
            </button>
            <button
              onClick={e => {
                this.handleClick('comment_count');
              }}
              className="filter-buttons"
            >
              comments
            </button>
          </div>

          {!isLoading ? (
            articles.map(article => {
              return (
                <Link
                  className="article-card"
                  to={`/articles/${article.article_id}`}
                  key={article.article_id}
                >
                  <ArticleCard article={article} />
                </Link>
              );
            })
          ) : (
            <JellyfishSpinner />
          )}
        </div>
      </>
    );
  }
}

export default ArticlesList;
