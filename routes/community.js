const express = require('express');
const router = express.Router();
const User = require('../db/user');
const Sticker = require('../db/sticker');
const Community = require('../db/community');
const Shared = require('../shared');


router.get('/:id', (req, res) => {
  if (!isNaN(req.params.id)) {
    const decoded = Shared.decode(req.headers['auth_token']);
    Shared.allowOrigin(res);
    Community.getOne(req.params.id, decoded.user_id).then(community => {
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
    const decoded = Shared.decode(req.headers['auth_token']);
    Community
      .getOneByName(req.body.name)
      .then(community => {
        if(!community) {
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
              const user_community_add = {
                user_id : decoded.user_id,
                community_id : id,
                role : 2,
                created_at : new Date(),
                };
              Community
              .addUser(user_community_add)
              
              res.json({
                id,
                message: 'community posted'
                });
              })
        } else {
          next(new Error('Community name in use'));
        }
      })
    
    
    // redirect
    } else {
        next(new Error('Invalid community'))
    }
    });

router.patch('/:id', (req, res) => {
  if (!isNaN(req.params.id)) {
    const decoded = Shared.decode(req.headers['auth_token']);
    Shared.allowOrigin(res);
    Community.getOneToUpdate(req.params.id, decoded.user_id).then(community => {
    if (community && community.role > 0) {
      console.log(community);
      const community_update = {
        id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        community_type: req.body.community_type,
      };
      Community
        .update(community_update)
        .then(id => {
          res.json({
            message: 'community updated'
            });
    }); //can probably simplify this function; don't need the id
  } else {
      if (community) {
        resError(res, 404, "Permission denied")
      } else {
        resError(res, 404, "Community Not Found");
      }
      
  }
  });
  } else {
    resError(res, 500, "Invalid ID");
  }
});

router.post('/delete/:id', (req, res) => {
  if (!isNaN(req.params.id)) {
      const decoded = Shared.decode(req.headers['auth_token']);
      Shared.allowOrigin(res);
      Community.getOneToUpdate(req.params.id, decoded.user_id).then(community => {
      if (community && community.role > 0) {
          Community.delete(req.params.id).then(id => {
            res.json({
                message: 'community deleted'
                });
              });
      } else {
        if (community) {
          resError(res, 404, "Permission Denied");
        } else {
          resError(res, 404, "Community Not Found");
        }
          
      }
      });
  } else {
      resError(res, 500, "Invalid ID");
  }
});

router.post('/addUser/:id', (req, res, next) => {
  const decoded = Shared.decode(req.headers['auth_token']);
  Shared.allowOrigin(res);
  const user_id = req.params.id;
  const community_id = req.body.community_id;
  const user_community_add = {
    user_id : req.params.id,
    community_id : req.body.community_id,
    role : 0,
    created_at : new Date(),
  }
  Community.getOne(community_id, decoded.user_id).then(community => {
    if (community && community.role > 0) {
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
                } else {
                  resError(res, 404, "User already added to Community");
                }
            })
          
        } else {
          res.json({message : 'Invalid User'})
        }
    });
  } else {
    if (community) {
      resError(res, 404, "Access Denied")
    } else {
      resError(res, 404, "Invalid Community")
    }
    
    };
  });
});

router.post('/removeUser/:id', (req, res) => {
  if (!isNaN(req.params.id)) {
      const decoded = Shared.decode(req.headers['auth_token']);
      Shared.allowOrigin(res);
      Community.getUserCommunity(decoded.user_id,req.body.community_id).then(auth => {
        Community.getUserCommunity(req.params.id, req.body.community_id).then(user_community => {
          if (user_community) {
            console.log('auth role: ', auth.role, ' user role: ', user_community.role)
            if (auth.role > user_community.role){
              Community.removeUser(user_community.id)
              .then(res.json(user_community));
            } else {
              resError(res, 404, "Unauthorized");
            }
           } else {
              resError(res, 404, "Community Not Found");
          }
          });
      })
      
  } else {
      resError(res, 500, "Invalid ID");
  }
});

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = router;