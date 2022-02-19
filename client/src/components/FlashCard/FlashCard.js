import React from 'react'
import './FlashCard.css'

function FlashCard() {
    return (
        <div className='card'>
            <img src='https://placekitten.com/200/200' />
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Curabitur sit amet felis elit. Nunc in volutpat tortor. 
                    Praesent ut sem eget diam auctor sollicitudin a vitae leo. 
                    Vivamus scelerisque neque vitae tortor varius tempor eget eu 
                    mi. Curabitur sit amet velit enim. Praesent convallis mollis 
                    mi vitae cursus. 
                </p>
        </div>
    )
}

export default FlashCard