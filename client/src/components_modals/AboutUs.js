import React from "react";
import Modal from 'react-bootstrap/Modal'

export default function AboutUs(props) {
    return (
        <Modal show={props.showModal} style={{marginTop: 60}} onHide={props.hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>About Us</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p id="regular-text">Hi! We're a group of college student/recent grads who want to play our part in the fight against COVID-19.
                </p>
                <p id="regular-text">
                    Inspired by acts of mutual aid in our community, we created<strong><font id="home" style={{fontSize: 18}}> covaid</font></strong>
                    , a tool to assist elderly and immunocompromised groups in this time of distress. We are neighbors that are truly concerned about our community
                    as well as those affected around the United States. With this tool, we hope to give those most affected and vulnerable the help they need. 
                </p>
                <p id="regular-text">
                    <strong>Any questions?</strong> Just email us at covaidco@gmail.com
                </p>
            </Modal.Body>
        </Modal>
    );
}
