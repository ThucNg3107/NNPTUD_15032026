var express = require('express');
var router = express.Router();

let userModel = require('../schemas/users');


/* GET users listing */
router.get('/', async function(req, res, next) {

    let result = await userModel.find({
        isDeleted:false
    }).populate("role");

    res.send(result);

});


router.get('/:id', async function(req, res, next) {

    try {

        let id = req.params.id;

        let result = await userModel.findOne({
            isDeleted:false,
            _id:id
        }).populate("role");

        if(result){
            res.send(result);
        }else{
            res.status(404).send({message:"user not found"});
        }

    } catch (error) {
        res.status(400).send(error);
    }

});


/* CREATE USER */
router.post('/', async function(req,res,next){

    try{

        let user = new userModel(req.body);

        await user.save();

        res.send(user);

    }catch(error){
        res.status(400).send(error);
    }

});


/* UPDATE USER */
router.put('/:id', async function(req,res,next){

    try{

        let id = req.params.id;

        let result = await userModel.findByIdAndUpdate(
            id,
            req.body,
            {new:true}
        );

        if(result){
            res.send(result);
        }else{
            res.status(404).send({message:"user not found"});
        }

    }catch(error){
        res.status(400).send(error);
    }

});


/* DELETE USER (soft delete) */
router.delete('/:id', async function(req,res,next){

    try{

        let id = req.params.id;

        let result = await userModel.findByIdAndUpdate(
            id,
            {isDeleted:true},
            {new:true}
        );

        if(result){
            res.send(result);
        }else{
            res.status(404).send({message:"user not found"});
        }

    }catch(error){
        res.status(400).send(error);
    }

});


/* ENABLE USER */
router.post('/enable', async function(req,res,next){

    try{

        let result = await userModel.findOne({
            username:req.body.username,
            email:req.body.email,
            isDeleted:false
        });

        if(result){

            result.status = true;

            await result.save();

            res.send(result);

        }else{
            res.status(404).send({message:"user not found"});
        }

    }catch(error){
        res.status(400).send(error);
    }

});


/* DISABLE USER */
router.post('/disable', async function(req,res,next){

    try{

        let result = await userModel.findOne({
            username:req.body.username,
            email:req.body.email,
            isDeleted:false
        });

        if(result){

            result.status = false;

            await result.save();

            res.send(result);

        }else{
            res.status(404).send({message:"user not found"});
        }

    }catch(error){
        res.status(400).send(error);
    }

});


module.exports = router;
