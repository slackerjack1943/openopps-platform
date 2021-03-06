const log = require('log')('app:comment');
const Router = require('koa-router');
const _ = require('lodash');
const auth = require('../auth/auth');
const service = require('./service');

var router = new Router();

router.post('/api/comment', auth, async (ctx, next) => {
  var attributes = ctx.request.body;
  _.extend(attributes, { userId: ctx.state.user.id } );
  await service.addComment(attributes, function (errors, comment) {
    if (errors) {
      ctx.status = 400;
      return ctx.body = errors;
    }
    service.sendCommentNotification(ctx.state.user, comment, 'comment.create.owner');
    ctx.body = comment;
  });
});

router.delete('/api/comment/:id', auth.isAdmin, async (ctx) => {
  ctx.body = await service.deleteComment(ctx.params.id);
});

module.exports = router.routes();
