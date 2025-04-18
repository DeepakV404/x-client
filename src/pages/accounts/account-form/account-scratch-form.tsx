import { useRef } from 'react';
import { Carousel} from 'antd'

const AccountScratchForm = () => {

    const carouselRef                   =   useRef<any>(null);

    return (
        <div className="j-new-acc-j-carousel cm-height100">
            <Carousel ref={carouselRef} className='j-acc-carousel cm-height100' dots={false} slide={`0`} accessibility={false}>
                <div className='j-acc-from-scratch-content'>
                </div>
            </Carousel>
        </div>
    )
}

export default AccountScratchForm