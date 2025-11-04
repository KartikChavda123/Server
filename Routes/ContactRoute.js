import express from 'express'
import { AddEnquiry, DeleteEnquiry, getAllEnquiry } from '../Controllar/ContactControllar.js'



const ContactRoute  = express.Router()


ContactRoute.post('/add-enquiry',AddEnquiry)


ContactRoute.get('/get-all-enquiry',getAllEnquiry)

ContactRoute.delete('/delete-enquiry/:id',DeleteEnquiry)





export default  ContactRoute    