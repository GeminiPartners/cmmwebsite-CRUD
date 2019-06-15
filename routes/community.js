const express = require('express');
const router = express.Router();
const User = require('../db/user');
const Sticker = require('../db/sticker');
const Community = require('../db/community');
const Shared = require('../shared');


router.get('/:id', (req, res) => {
  if (!isNaN(req.params.id)) {
    Shared.allowOrigin(res);
    Community.getOne(req.params.id).then(community => {
      if (community) {
        res.json(community);
      } else {
        resError(res, 404, "Community Not Found");
      }
    });
  } else {
    resError(res, 500, "Invalid ID");
  }
});

function validCommunity(community) {
    const validName = community.name.trim() != '';
    const validDescription = community.description.trim() != ''; 
    return validName && validDescription
};

function validCommunityUser(community_id, user_id) {
  Community.getOne(community_id).then(community => {
      if (community) {
       console.log(community);
      User.getOne(user_id).then(user => {
        console.log(user);
        return true
      });
    } else {
      console.log(false);
      return false
    };
  });
}

router.post('/create', (req, res, next) => {
    if(validCommunity(req.body)) {
        Shared.allowOrigin(res);
        const community = {
            name: req.body.name,
            description: req.body.description,
            community_type: req.body.community_type,
            created_at: new Date()
        };

        Community
            .create(community)
            .then(id => {
                res.json({
                    id,
                    message: 'community posted'
                    });
        });
        // redirect
        } else {
            next(new Error('Invalid community'))
        }
        });

router.patch('/:id', (req, res) => {
  if (!isNaN(req.params.id)) {
      Shared.allowOrigin(res);
      Community.getOneToUpdate(req.params.id, req.body.user_id).then(community => {
      if (community) {
          const community = {
            id: req.params.id,
            name: req.body.name,
            description: req.body.description,
            community_type: req.body.community_type,
          };
          Community
              .update(community)
              .then(id => {
                  res.json({
                      message: 'community updated'
                      });
          }); //can probably simplify this function; don't need the id
      } else {
          resError(res, 404, "Community Not Found");
      }
      });
  } else {
      resError(res, 500, "Invalid ID");
  }
});

router.post('/delete/:id', (req, res) => {
  if (!isNaN(req.params.id)) {
      Shared.allowOrigin(res);
      Community.getOneToUpdate(req.params.id).then(community => {
      if (community) {
          Community.delete(req.params.id).then(id => {
            res.json({
                message: 'community deleted'
                });
              });
      } else {
          resError(res, 404, "Community Not Found");
      }
      });
  } else {
      resError(res, 500, "Invalid ID");
  }
});

router.post('/addUser/:id', (req, res, next) => {
  Shared.allowOrigin(res);
  const user_id = req.params.id;
  const community_id = req.body.community_id;
  const user_community_add = {
    user_id : req.params.id,
    community_id : req.body.community_id,
    role : 0,
    created_at : new Date(),
  }
  Community.getOne(community_id).then(community => {
    if (community) {
      User.getOne(user_id).then(user => {
        if(user) {
          Community.getUserCommunity(user_id, community_id).then(user_community => {
            if(!user_community) {
              Community
              .addUser(user_community_add)
              .then(id => {
                res.json({
                    id,
                    message: 'User added to Community'
                    });
                  })
                }
            })
          
        } else {
          res.json({message : 'Invalid User'})
        }
    });
  } else {
    res.json({message : "Invalid Community"})
    };
  });
});

router.post('/removeUser/:id', (req, res) => {
  if (!isNaN(req.params.id)) {
      Shared.allowOrigin(res);
      Community.getUserCommunity(req.params.id, req.body.community_id).then(user_community => {
      if (user_community) {
             Community.removeUser(user_community.id)
             .then(res.json(user_community));
       } else {
          resError(res, 404, "Community Not Found");
      }
      });
  } else {
      resError(res, 500, "Invalid ID");
  }
});

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = router;