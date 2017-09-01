import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import shortid from'shortid';

export const Links = new Mongo.Collection('links');

if (Meteor.isServer) {
    Meteor.publish('links', function () {
        this.userId
        return Links.find({userId: this.userId});
    });
}

Meteor.methods({
    'links.insert'(url) {
        //Check user is logged in
        if (!this.userId) {
            throw new Meteor.Error('not-authorised');
        }

        //Validate URL
            new SimpleSchema({
              url: {
                type: String,
                //replace error property name (Url) with a label property
                label: 'Your link',
                regEx: SimpleSchema.RegEx.Url
              }
            }).validate({ url });

        //Can only insert these properties
        Links.insert({
            //Use shortid to overide meteor generated id
            _id: shortid.generate(),
            url,
            userId: this.userId,
            visible: true,
            visitedCount: 0,
            lastVisitedAt: null
        });
    },
    'links.setVisibility'(_id, visible) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorised');
        } 
        
        new SimpleSchema({
            _id: { 
                type: String, 
                min: 1 
            },
            visible: {
                type: Boolean
            }
        }).validate({ _id, visible});

        Links.update({
            _id,
            userId: this.userId
        }, {
            $set: { visible }
        });
    },
    'links.trackVisit'(_id) {
        new SimpleSchema({
            _id: { 
                type: String, 
                min: 1 
            }
        }).validate({ _id});

        Links.update({ _id: _id}, {
            $set: {
                lastVisitedAt: new Date().getTime()
            },
            $inc: {
                visitedCount: 1
            }
        })
    }
});

